class Api::V1::UsersController < ApplicationController
  def create
    # Request refresh and access tokens
    body = {
      grant_type: "authorization_code",
      code: params[:code],
      redirect_uri: 'http://localhost:3000/api/v1/user',
      client_id: ENV.fetch('SPOTIFY_CLIENT_ID'),
      client_secret: ENV.fetch('SPOTIFY_CLIENT_SECRET')
    }

    auth_response = RestClient.post('https://accounts.spotify.com/api/token', body)
    auth_params = JSON.parse(auth_response.body)
    header = {
      Authorization: "Bearer #{auth_params['access_token']}"
    }

    user_response = RestClient.get("https://api.spotify.com/v1/me", header)
    user_params = JSON.parse(user_response.body)

    # Create User
    @user = User.find_or_create_by(
      name: user_params["display_name"],
      spotify_url: user_params["external_urls"]["spotify"],
      href: user_params["href"],
      uri: user_params["uri"],
      spotify_id: user_params["id"]
    )

    image = user_params["images"][0] ? user_params["images"][0]["url"] : nil
    country = user_params["country"] || nil

    # Update the user if they have image or country
    @user.update(image:, country:)

    # Update the user access/refresh_tokens
    if @user.access_token_expired?
      @user.refresh_access_token
    else
      @user.update(
        access_token: auth_params["access_token"],
        refresh_token: auth_params["refresh_token"]
      )
    end

    # Redirect to Front End app homepage
    redirect_to "http://localhost:4500/cookbook/#{@user.id}", allow_other_host: true
  end
end
